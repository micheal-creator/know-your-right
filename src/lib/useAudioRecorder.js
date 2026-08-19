import { useCallback, useEffect, useRef, useState } from 'react'

// Encapsulates microphone capture with the MediaRecorder API.
// status: 'idle' | 'requesting' | 'recording' | 'saving' | 'error'
export function useAudioRecorder() {
  const [status, setStatus] = useState('idle')
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState('')

  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const startedAtRef = useRef(0)
  const mimeRef = useRef('')
  const stopResolveRef = useRef(null)

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const releaseStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  const cleanup = useCallback(() => {
    clearTimer()
    releaseStream()
    recorderRef.current = null
  }, [])

  useEffect(() => cleanup, [cleanup])

  function pickMimeType() {
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/ogg']
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return ''
    for (const t of candidates) {
      if (MediaRecorder.isTypeSupported(t)) return t
    }
    return ''
  }

  const start = useCallback(async () => {
    setError('')
    const secureOk = window.isSecureContext || location.hostname === 'localhost'
    if (!secureOk) {
      setError('Recording needs a secure (https) connection.')
      setStatus('error')
      return false
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Audio recording is not supported on this device or browser.')
      setStatus('error')
      return false
    }
    try {
      setStatus('requesting')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mime = pickMimeType()
      mimeRef.current = mime
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeRef.current || 'audio/webm' })
        cleanup()
        setStatus('idle')
        setSeconds(0)
        const resolve = stopResolveRef.current
        stopResolveRef.current = null
        resolve?.(blob)
      }

      recorder.start(1000) // gather data every second
      recorderRef.current = recorder
      startedAtRef.current = Date.now()
      setSeconds(0)
      timerRef.current = setInterval(
        () => setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000)),
        500,
      )
      setStatus('recording')
      return true
    } catch (err) {
      cleanup()
      const denied = err && (err.name === 'NotAllowedError' || err.name === 'SecurityError')
      setError(denied ? 'Microphone permission was denied.' : 'Could not start recording.')
      setStatus('error')
      return false
    }
  }, [cleanup])

  // Stops and resolves with the recorded Blob (or null).
  const stop = useCallback(() => {
    return new Promise((resolve) => {
      const rec = recorderRef.current
      if (!rec || rec.state === 'inactive') {
        resolve(null)
        return
      }
      stopResolveRef.current = resolve
      setStatus('saving')
      try {
        rec.stop()
      } catch {
        cleanup()
        setStatus('idle')
        resolve(null)
      }
    })
  }, [cleanup])

  // Discards the recording without saving.
  const cancel = useCallback(() => {
    const rec = recorderRef.current
    if (rec && rec.state !== 'inactive') {
      stopResolveRef.current = () => {}
      try {
        rec.stop()
      } catch {
        /* ignore */
      }
    }
    cleanup()
    setStatus('idle')
    setSeconds(0)
    setError('')
  }, [cleanup])

  return { status, seconds, error, start, stop, cancel }
}

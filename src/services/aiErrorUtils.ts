export type AIServiceErrorCode =
  | 'missing_key'
  | 'api_disabled'
  | 'auth'
  | 'quota'
  | 'rate_limit'
  | 'unavailable'
  | 'invalid_response'
  | 'unknown'

type AIServiceErrorOptions = {
  code: AIServiceErrorCode
  userMessage: string
  rawMessage: string
  retriable?: boolean
}

export class AIServiceError extends Error {
  code: AIServiceErrorCode
  userMessage: string
  rawMessage: string
  retriable: boolean

  constructor(options: AIServiceErrorOptions) {
    super(options.userMessage)
    this.name = 'AIServiceError'
    this.code = options.code
    this.userMessage = options.userMessage
    this.rawMessage = options.rawMessage
    this.retriable = options.retriable ?? false
  }
}

const getRawMessage = (err: unknown): string => {
  if (err instanceof Error && typeof err.message === 'string') return err.message
  if (typeof err === 'string') return err
  return 'Unknown AI provider error'
}

export const isAIServiceError = (err: unknown): err is AIServiceError =>
  err instanceof AIServiceError

export const normalizeGeminiError = (err: unknown): AIServiceError => {
  const rawMessage = getRawMessage(err)
  const message = rawMessage.toLowerCase()

  if (message.includes('gemini_api_key is missing')) {
    return new AIServiceError({
      code: 'missing_key',
      userMessage:
        'GEMINI_API_KEY is missing on the backend. Add it to the deployment environment, then redeploy the API.',
      rawMessage,
    })
  }

  if (
    message.includes('service_disabled') ||
    message.includes('has not been used in project') ||
    message.includes('enable it by visiting')
  ) {
    return new AIServiceError({
      code: 'api_disabled',
      userMessage:
        'Gemini API is disabled for the configured Google project. Enable the Generative Language API in Google Cloud for that project, wait a few minutes, then redeploy the backend.',
      rawMessage,
    })
  }

  if (
    message.includes('api key not valid') ||
    message.includes('permission_denied') ||
    message.includes('forbidden')
  ) {
    return new AIServiceError({
      code: 'auth',
      userMessage:
        'The configured Gemini credentials are not allowed to use this model. Check that GEMINI_API_KEY belongs to the correct Google project and has access to the Gemini API.',
      rawMessage,
    })
  }

  if (message.includes('quota') || message.includes('resource_exhausted')) {
    return new AIServiceError({
      code: 'quota',
      userMessage:
        'The Gemini quota for this project has been exhausted. Increase quota or wait for it to reset, then retry.',
      rawMessage,
      retriable: true,
    })
  }

  if (message.includes('429') || message.includes('rate limit')) {
    return new AIServiceError({
      code: 'rate_limit',
      userMessage: 'Gemini is rate limiting requests right now. Please retry in a moment.',
      rawMessage,
      retriable: true,
    })
  }

  if (
    message.includes('unavailable') ||
    message.includes('deadline exceeded') ||
    message.includes('timed out') ||
    message.includes('econnreset') ||
    message.includes('enotfound') ||
    message.includes('fetch failed')
  ) {
    return new AIServiceError({
      code: 'unavailable',
      userMessage: 'Gemini is temporarily unavailable. Please retry shortly.',
      rawMessage,
      retriable: true,
    })
  }

  if (
    message.includes('failed to parse gemini response as json') ||
    message.includes('gemini returned invalid response format') ||
    message.includes('gemini returned invalid test questions')
  ) {
    return new AIServiceError({
      code: 'invalid_response',
      userMessage: 'Gemini returned an invalid response for this request. Please retry.',
      rawMessage,
      retriable: true,
    })
  }

  return new AIServiceError({
    code: 'unknown',
    userMessage: 'The AI provider failed to process this request.',
    rawMessage,
    retriable: true,
  })
}

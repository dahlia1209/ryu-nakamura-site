export interface Recipient {
  address: string
}

export interface Recipients {
  to: Recipient[]
}

export interface EmailContent {
  subject: string
  plainText: string
  html: string
}

export interface EmailMessage {
  senderAddress: string
  recipients: Recipients
  content: EmailContent
  senderName?: string
}
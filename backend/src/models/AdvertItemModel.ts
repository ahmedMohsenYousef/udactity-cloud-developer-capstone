export interface advertisementItem {
  userId: string
  advertisementId: string
  createdAt: string
  make:string,
  model: string,
  year: number,
  mileage: number,
  price: number,
  contactInfo:string,
  description:string,
  attachmentUrl?: string
}

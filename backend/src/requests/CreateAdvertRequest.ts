/**
 * Fields in a request to create a single Advert item.
 */
export interface CreateAdvertRequest {
  make: string
  model: string
  year: number
  mileage: number
  description: string
  contactInfo: string
  price: number
}

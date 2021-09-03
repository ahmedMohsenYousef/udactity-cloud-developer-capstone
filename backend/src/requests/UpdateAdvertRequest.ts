/**
 * Fields in a request to update a single Advert item.
 */
export interface UpdateAdvertRequest {
  make: string
  model: string
  year: number
  mileage: number
  description: string
  contactInfo: string
  price: number
}
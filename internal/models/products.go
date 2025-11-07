package models

type Product struct {
	Id             int     `json:"id"`
	Name           string  `json:"name"`
	Description    string  `json:"description"`
	Quantity       int     `json:"quantity"`
	Price          float64 `json:"price"`
	WarrantyMonths int     `json:"warranty_months"`
	Distributor    string  `json:"distributor"`
	CategoryId     int     `json:"category_id"`
}

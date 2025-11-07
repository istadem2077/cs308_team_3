package models

type Review struct {
	Id        int    `json:"id"`
	ProductId int    `json:"product_id"`
	UserId    int    `json:"user_id"`
	Rating    int    `json:"rating"`
	Comment   string `json:"comment"`
	CreatedAt string `json:"created_at"`
}

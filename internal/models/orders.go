package models

type Order struct {
	Id        int    `json:"id"`
	UserId    int    `json:"user_id"`
	Status    string `json:"status"`
	CreatedAt string `json:"created_at"`
}

package models

import "database/sql"

type Review struct {
	Id        int    `json:"id"`
	ProductId int    `json:"product_id"`
	UserId    int    `json:"user_id"`
	Rating    int    `json:"rating"`
	Comment   string `json:"comment"`
	CreatedAt string `json:"created_at"`
}

type ReviewModel struct {
	DB *sql.DB
}

//func (ReviewModel *ReviewModel) GetReviewByID(id int) (*Review, error) {}
//func (ReviewModel *ReviewModel) GetAllReviews() ([]Review, error) {}

package model

const (
	RoleClient       = "cliente"
	RoleTattooArtist = "tatuadora"
)

type User struct {
	ID           int64
	Name         string
	Email        string
	PasswordHash string
	Role         string
}

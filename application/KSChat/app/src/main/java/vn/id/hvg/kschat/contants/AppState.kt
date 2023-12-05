package vn.id.hvg.kschat.contants

enum class LoginState {
    SUCCESS, INCORRECT_CREDENTIALS, NETWORK_ERROR, UNKNOWN_ERROR
}

enum class RegisterState {
    SUCCESS, USERNAME_TAKEN, NETWORK_ERROR, UNKNOWN_ERROR, BAD_REQUEST
}


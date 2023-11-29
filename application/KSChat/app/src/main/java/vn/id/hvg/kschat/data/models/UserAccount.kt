package vn.id.hvg.kschat.data.models

import com.google.gson.annotations.SerializedName

data class UserAccount(
    val id: String,
    val email: String,
    val password: String
)

package vn.id.hvg.kschat.data.network.model.auth

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
data class RegisterResponse(
    @SerializedName("message") val message: String,
    @SerializedName("data") val data: DataRegisterResponse
): Parcelable

@Parcelize
data class DataRegisterResponse(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("_id") val id: String,
    @SerializedName("createdAt") val createdAt: String,
    @SerializedName("updatedAt") val updatedAt: String,
    @SerializedName("__v") val __v: String
): Parcelable

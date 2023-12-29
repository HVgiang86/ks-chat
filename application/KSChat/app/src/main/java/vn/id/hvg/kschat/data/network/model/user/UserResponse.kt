package vn.id.hvg.kschat.data.network.model.user

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
data class UserResponse(
    @SerializedName("message") val message: String,
    @SerializedName("data") val data: DataUserResponse
) : Parcelable

@Parcelize
data class DataUserResponse(
    @SerializedName("_id") val id: String,
    @SerializedName("country") val country: String,
    @SerializedName("email") val email: String,
    @SerializedName("createdAt") val createdAt: String,
    @SerializedName("updatedAt") val updatedAt: String,
    @SerializedName("__v") val v: Int,
    @SerializedName("bio") val bio: String,
    @SerializedName("dateOfBirth") val dateOfBirth: String,
    @SerializedName("firstName") val firstName: String,
    @SerializedName("gender") val gender: String,
    @SerializedName("interest") val interest: String,
    @SerializedName("lastName") val lastName: String,
    @SerializedName("publicUsers") val publicUsers: List<String>,
    @SerializedName("age") val age: Int,
) : Parcelable

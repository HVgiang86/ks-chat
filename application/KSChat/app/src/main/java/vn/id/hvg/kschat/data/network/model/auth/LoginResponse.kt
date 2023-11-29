package vn.id.hvg.kschat.data.network.model.auth

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

@Parcelize
data class LoginResponse(
    @SerializedName("message") @Expose val message: String,
    @SerializedName("access_token") @Expose val token: String,
    @SerializedName("refresh_token") @Expose val refreshToken: String
) : Parcelable

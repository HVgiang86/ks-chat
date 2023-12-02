package vn.id.hvg.kschat.data.network.model.auth

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
data class RefreshTokenResponse(
    @SerializedName("message") val message: String,
    @SerializedName("access_token") val token: String
) : Parcelable

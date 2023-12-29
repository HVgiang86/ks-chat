package vn.id.hvg.kschat.data.network.model

import android.os.Parcelable
import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
data class MessageOnlyResponse(
    @SerializedName("message") @Expose val message: String
) : Parcelable

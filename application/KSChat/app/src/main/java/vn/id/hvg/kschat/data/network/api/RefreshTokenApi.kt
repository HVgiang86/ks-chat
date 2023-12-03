package vn.id.hvg.kschat.data.network.api

import retrofit2.Call
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST
import vn.id.hvg.kschat.data.network.model.auth.RefreshTokenResponse

interface RefreshTokenApi {
    @FormUrlEncoded
    @POST(REFRESH_TOKEN_ENDPOINT)
    suspend fun refreshToken(
    ): Call<RefreshTokenResponse?>
}
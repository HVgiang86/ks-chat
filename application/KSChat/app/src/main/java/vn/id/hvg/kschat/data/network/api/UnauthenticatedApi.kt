package vn.id.hvg.kschat.data.network.api

import retrofit2.Call
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST
import vn.id.hvg.kschat.data.network.model.auth.RegisterResponse

interface UnauthenticatedApi {
    @FormUrlEncoded
    @POST(REGISTER_ENDPOINT)
    suspend fun register(
        @Field("email") email: String,
        @Field("password") password: String
    ): Call<RegisterResponse?>
}
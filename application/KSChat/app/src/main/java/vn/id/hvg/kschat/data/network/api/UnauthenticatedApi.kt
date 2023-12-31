package vn.id.hvg.kschat.data.network.api

import retrofit2.Response
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST
import vn.id.hvg.kschat.data.network.model.auth.LoginResponse
import vn.id.hvg.kschat.data.network.model.auth.RegisterResponse

interface UnauthenticatedApi {
    @FormUrlEncoded
    @POST(REGISTER_ENDPOINT)
    suspend fun register(
        @Field("email") email: String,
        @Field("password") password: String
    ): Response<RegisterResponse>

    @FormUrlEncoded
    @POST(LOGIN_ENDPOINT)
    suspend fun login(
        @Field("email") email: String,
        @Field("password") password: String
    ): Response<LoginResponse>
}
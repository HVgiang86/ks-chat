package vn.id.hvg.kschat.data.network.api

import retrofit2.Call
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST
import vn.id.hvg.kschat.data.network.model.auth.LoginResponse

interface AuthenticatedApi {
    @FormUrlEncoded
    @POST(LOGIN_ENDPOINT)
    suspend fun login(
        @Field("email") email: String,
        @Field("password") password: String
    ): Call<LoginResponse?>






}
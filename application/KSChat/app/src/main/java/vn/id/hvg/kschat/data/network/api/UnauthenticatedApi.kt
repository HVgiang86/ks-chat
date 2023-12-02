package vn.id.hvg.kschat.data.network.api

import okhttp3.Response
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST
import vn.id.hvg.kschat.data.network.model.auth.LoginResponse
import vn.id.hvg.kschat.data.network.model.auth.RegisterResponse

interface UnauthenticatedApi {
    @FormUrlEncoded
    @POST(REGISTER_ENDPOINT)
    fun register(
        @Field("email") email: String,
        @Field("password") password: String
    ): Call<Response>

    @FormUrlEncoded
    @POST(LOGIN_ENDPOINT)
    suspend fun login(
        @Field("email") email: String,
        @Field("password") password: String
    ): retrofit2.Response<LoginResponse>
}
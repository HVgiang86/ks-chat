package vn.id.hvg.kschat.data.network.api

import retrofit2.Response
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.PUT
import vn.id.hvg.kschat.data.network.model.user.UserResponse

interface AuthenticatedApi {
    @GET(GET_ME_ENDPOINT)
    suspend fun getMyProfile(
    ): Response<UserResponse>

    @FormUrlEncoded
    @PUT(USER_UPDATE_ENDPOINT)
    suspend fun updateProfile(
        @Field("firstName") firstName: String,
        @Field("lastName") lastName: String,
        @Field("dateOfBirth") dateOfBirth: String,
        @Field("gender") gender: String,
        @Field("bio") bio: String,
        @Field("age") age: String,
        @Field("interest") interest: String,
    ): Response<UserResponse>

    @FormUrlEncoded
    @PUT(USER_CHANGE_PASSWORD_ENDPOINT)
    suspend fun changePassword(
        @Field("currentPassword") currentPassword: String, @Field("newPassword") newPassword: String
    ): Response<UserResponse>


}


package vn.id.hvg.kschat.data.repositories

import android.util.Log
import vn.id.hvg.kschat.contants.Country
import vn.id.hvg.kschat.contants.Gender
import vn.id.hvg.kschat.data.network.api.AuthenticatedApi
import vn.id.hvg.kschat.data.network.api.RefreshTokenApi
import vn.id.hvg.kschat.data.network.api.UnauthenticatedApi
import vn.id.hvg.kschat.data.network.retrofit.apiauth.JwtTokenManager
import vn.id.hvg.kschat.data.room.dao.ProfileDao
import vn.id.hvg.kschat.data.room.dao.UserDao
import vn.id.hvg.kschat.data.room.model.Profile
import java.util.Locale
import javax.inject.Inject

class UserRepositoryImpl @Inject constructor(
    private val authenticatedApi: AuthenticatedApi,
    private val tokenResponse: RefreshTokenApi,
    private val unauthenticatedApi: UnauthenticatedApi,
    private val jwtTokenManager: JwtTokenManager,
    private val userDao: UserDao,
    private val profileDao: ProfileDao
) : UserRepository {
    override suspend fun getMyProfile(): Profile? {
        Log.d("HAHA", "get my profile called")
        try {
            val response = authenticatedApi.getMyProfile()
            if (response.isSuccessful) {
                val profileBody = response.body()
                val data = profileBody?.data

                val id = data?.id.toString()
                val country = data?.country.toString()
                val email = data?.email.toString()
                val age = data?.age
                val gender = data?.gender.toString()
                val bio = data?.bio.toString()
                val firstName = data?.firstName.toString()
                val lastName = data?.lastName.toString()
                val interest = data?.interest.toString()
                val avatarUrl = ""
                val publicUsers = data?.publicUsers
                val dateOfBirth = data?.dateOfBirth.toString()

                val profile = Profile(
                    id,
                    firstName,
                    lastName,
                    Gender.valueOf(gender.uppercase(Locale.getDefault())),
                    dateOfBirth,
                    Country.valueOf(country.uppercase(Locale.getDefault())),
                    interest,
                    bio,
                    avatarUrl
                )
                Log.d("HAHA", "Profile got: $profile")

                profile.let {
                    profileDao.insertProfile(it)
                }

                return profile
            } else {
                return null
            }
        } catch (e: Exception) {
            e.printStackTrace()
            return null
        }
    }

    override suspend fun getProfileById(id: String) {
        TODO("Not yet implemented")
    }

    override suspend fun getAllSharedProfile() {
        TODO("Not yet implemented")
    }

    override suspend fun updateProfile() {
        TODO("Not yet implemented")
    }
}
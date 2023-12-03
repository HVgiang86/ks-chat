package vn.id.hvg.kschat.data.models

import vn.id.hvg.kschat.contants.Country
import vn.id.hvg.kschat.contants.Gender
import java.util.Date

data class UserProfile(
    val id: String,
    val firstName: String,
    val lastName: String,
    val gender: Gender,
    val dateOfBirth: Date,
    val country: Country,
    val interests: String,
    val language: String,
    val bio: String,
    val avatarUri: String
)

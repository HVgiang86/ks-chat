package vn.id.hvg.kschat.data.room.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import vn.id.hvg.kschat.contants.Country
import vn.id.hvg.kschat.contants.Gender

@Entity(tableName = "profile")
data class Profile(
    @PrimaryKey val id: Int,
    val firstName: String,
    val lastName: String,
    val gender: Gender,
    val dateOfBirth: String,
    val country: Country,
    val interests: String,
    val language: String,
    val bio: String,
    val avatarUrl: String
)
package vn.id.hvg.kschat.data.room.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "user")
data class User(
    @PrimaryKey val id: Int,
    val sharedProfileId: List<String>
)

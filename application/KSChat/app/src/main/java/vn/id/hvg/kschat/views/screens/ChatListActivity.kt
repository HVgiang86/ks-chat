package vn.id.hvg.kschat.views.screens

import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import dagger.hilt.android.AndroidEntryPoint
import vn.id.hvg.kschat.R
import vn.id.hvg.kschat.databinding.ActivityChatListBinding
import vn.id.hvg.kschat.viewmodels.ChatListModel

@AndroidEntryPoint
class ChatListActivity : AppCompatActivity() {
    private val chatListModel: ChatListModel by viewModels()
    private lateinit var binding: ActivityChatListBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding =
            DataBindingUtil.setContentView(this, R.layout.activity_chat_list) as ActivityChatListBinding
        binding.mainViewModel = chatListModel
        binding.lifecycleOwner = this

        val actionBar = binding.topAppBar
        val drawerLayout = binding.myDrawerLayout

        actionBar.setNavigationOnClickListener {
            binding.myDrawerLayout.open()
        }

        val actionBarDrawerToggle = ActionBarDrawerToggle(
            this,
            drawerLayout,
            R.string.nav_open,
            R.string.nav_close
        )
        drawerLayout.addDrawerListener(actionBarDrawerToggle)
        actionBarDrawerToggle.syncState()

        actionBar.title = "Chats"


    }
}
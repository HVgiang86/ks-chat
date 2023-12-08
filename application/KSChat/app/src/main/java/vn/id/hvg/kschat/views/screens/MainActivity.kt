package vn.id.hvg.kschat.views.screens

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import dagger.hilt.android.AndroidEntryPoint
import vn.id.hvg.kschat.R
import vn.id.hvg.kschat.databinding.ActivityMainBinding
import vn.id.hvg.kschat.viewmodels.MainViewModel

@AndroidEntryPoint
class MainActivity : AppCompatActivity() {
    private val mainViewModel: MainViewModel by viewModels()
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding =
            DataBindingUtil.setContentView(this, R.layout.activity_main) as ActivityMainBinding
        binding.mainViewModel = mainViewModel
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
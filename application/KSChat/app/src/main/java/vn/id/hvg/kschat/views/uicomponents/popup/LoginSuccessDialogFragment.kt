package vn.id.hvg.kschat.views.uicomponents.popup

import android.app.Dialog
import android.os.Bundle
import android.view.Window
import androidx.appcompat.widget.AppCompatTextView
import androidx.fragment.app.DialogFragment
import vn.id.hvg.kschat.R

class LoginSuccessDialogFragment : DialogFragment(){
    companion object {
        internal const val NAME_KEY = "NAME_KEY"

        fun newInstance(
            name: String?
        ): LoginSuccessDialogFragment {
            return LoginSuccessDialogFragment().apply {
                arguments = Bundle().apply {
                    putString(NAME_KEY, name)
                }
            }
        }
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val name = arguments?.getString(NAME_KEY).orEmpty()

        val dialog = context?.let { Dialog(it, R.style.AppThemeNew_DialogTheme) }
        dialog?.requestWindowFeature(Window.FEATURE_NO_TITLE)
        dialog?.setContentView(R.layout.layout_login_success_dialog)
        dialog?.show()
        val content = dialog?.findViewById<AppCompatTextView>(R.id.tv_message)
        content?.text = name
        return dialog!!
    }


}
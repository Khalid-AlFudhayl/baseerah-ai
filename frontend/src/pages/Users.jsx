import { useEffect, useState } from 'react'
import API from '../services/api'

function Users() {
  const [users, setUsers] = useState([])

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'viewer'
  })

  const fetchUsers = async () => {
    try {
      const response = await API.get('/users')
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const addUser = async (e) => {
    e.preventDefault()

    if (
      !formData.full_name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      alert('يرجى تعبئة جميع البيانات')
      return
    }

    try {
      await API.post('/auth/register', formData)

      setFormData({
        full_name: '',
        email: '',
        password: '',
        role: 'viewer'
      })

      fetchUsers()
    } catch (error) {
      console.log(error)
      alert('تعذر إضافة المستخدم')
    }
  }

  const updateRole = async (id, role) => {
    try {
      await API.put(`/users/${id}/role`, { role })
      fetchUsers()
    } catch (error) {
      console.log(error)
      alert('تعذر تحديث الصلاحية')
    }
  }

  const deleteUser = async (id) => {
    const confirmDelete = confirm(
      'هل أنت متأكد من حذف المستخدم؟'
    )

    if (!confirmDelete) return

    try {
      await API.delete(`/users/${id}`)
      fetchUsers()
    } catch (error) {
      console.log(error)
      alert('تعذر حذف المستخدم')
    }
  }

  return (
    <div className="space-y-6">

      <div className="
        bg-[#101827]/85
        border
        border-cyan-500/10
        rounded-3xl
        p-6
      ">

        <div className="mb-6">

          <h2 className="text-3xl font-black text-white">
            إضافة مستخدم جديد
          </h2>

          <p className="text-gray-400 mt-2">
            إنشاء حساب جديد داخل منصة بصيرة
          </p>

        </div>

        <form
          onSubmit={addUser}
          className="grid grid-cols-1 xl:grid-cols-4 gap-4"
        >

          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="الاسم الكامل"
            className="
              bg-[#0B1220]
              border
              border-cyan-500/20
              rounded-2xl
              px-4
              py-4
              outline-none
              text-white
            "
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="البريد الإلكتروني"
            className="
              bg-[#0B1220]
              border
              border-cyan-500/20
              rounded-2xl
              px-4
              py-4
              outline-none
              text-white
            "
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="كلمة المرور"
            className="
              bg-[#0B1220]
              border
              border-cyan-500/20
              rounded-2xl
              px-4
              py-4
              outline-none
              text-white
            "
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="
              bg-[#0B1220]
              border
              border-cyan-500/20
              rounded-2xl
              px-4
              py-4
              outline-none
              text-white
            "
          >
            <option value="viewer">Viewer</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="
              xl:col-span-4
              bg-cyan-400
              text-black
              font-black
              rounded-2xl
              py-4
              hover:bg-cyan-300
              transition
            "
          >
            إضافة المستخدم
          </button>

        </form>

      </div>

      <div className="
        bg-[#101827]/85
        border
        border-cyan-500/10
        rounded-3xl
        p-6
      ">

        <div className="mb-6">

          <h2 className="text-3xl font-black text-white">
            إدارة المستخدمين
          </h2>

          <p className="text-gray-400 mt-2">
            التحكم بالمستخدمين والصلاحيات
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-cyan-500/10">

                <th className="py-4 text-right">
                  الاسم
                </th>

                <th className="py-4 text-right">
                  البريد
                </th>

                <th className="py-4 text-center">
                  الدور
                </th>

                <th className="py-4 text-center">
                  تاريخ الإنشاء
                </th>

                <th className="py-4 text-center">
                  التحكم
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="border-b border-cyan-500/5"
                >

                  <td className="py-4">
                    {user.full_name}
                  </td>

                  <td className="py-4">
                    {user.email}
                  </td>

                  <td className="py-4 text-center">

                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateRole(
                          user.id,
                          e.target.value
                        )
                      }
                      className="
                        bg-[#0B1220]
                        border
                        border-cyan-500/20
                        rounded-xl
                        px-3
                        py-2
                        text-white
                      "
                    >

                      <option value="viewer">
                        Viewer
                      </option>

                      <option value="manager">
                        Manager
                      </option>

                      <option value="admin">
                        Admin
                      </option>

                    </select>

                  </td>

                  <td className="py-4 text-center text-gray-400">
                    {new Date(user.created_at)
                      .toLocaleDateString('ar-SA')}
                  </td>

                  <td className="py-4 text-center">

                    <button
                      onClick={() =>
                        deleteUser(user.id)
                      }
                      className="
                        bg-red-500/20
                        text-red-300
                        px-4
                        py-2
                        rounded-xl
                        hover:bg-red-500/30
                        transition
                      "
                    >
                      حذف
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Users
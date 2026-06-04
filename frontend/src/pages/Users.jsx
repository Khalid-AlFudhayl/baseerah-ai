import { useEffect, useState } from 'react'
import API from '../services/api'

function Users() {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('baseerah_token')

      const response = await API.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const updateRole = async (id, role) => {
    try {
      const token = localStorage.getItem('baseerah_token')

      await API.put(
        `/users/${id}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchUsers()
    } catch (error) {
      console.log(error)
    }
  }

  const deleteUser = async (id) => {
    const confirmDelete = confirm(
      'هل أنت متأكد من حذف المستخدم؟'
    )

    if (!confirmDelete) return

    try {
      const token = localStorage.getItem('baseerah_token')

      await API.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchUsers()
    } catch (error) {
      console.log(error)
    }
  }

  return (
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
  )
}

export default Users
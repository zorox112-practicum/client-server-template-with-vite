import { useSelector } from '../store'

import { fetchUserThunk, selectUser } from '../slices/userSlice'
import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitPageArgs } from '../routes'

export const MainPage = () => {
  const user = useSelector(selectUser)

  usePage({ initPage: initMainPage })
  return (
    <div>
      <Header />
      {user ? (
        <div>
          <p>{user.name}</p>
          <p>{user.secondName}</p>
        </div>
      ) : (
        <p>Пользователь не найден!</p>
      )}
    </div>
  )
}

export const initMainPage = async ({ dispatch, state }: PageInitPageArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk())
  }
}

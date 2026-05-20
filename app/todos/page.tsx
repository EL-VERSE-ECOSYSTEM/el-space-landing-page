import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

interface Todo {
  id: string;
  name: string;
}

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <ul className="list-disc pl-5">
        {(todos as Todo[] | null)?.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
      {!todos?.length && <p className="text-gray-500">No todos found.</p>}
    </div>
  )
}

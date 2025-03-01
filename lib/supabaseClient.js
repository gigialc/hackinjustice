// Temporary placeholder until you're ready to use Supabase
export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null })
      }),
      or: () => ({
        data: []
      }),
      filter: () => ({
        gte: () => ({
          data: []
        }),
        eq: () => ({
          data: []
        })
      }),
      data: []
    })
  }),
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  }
}; 
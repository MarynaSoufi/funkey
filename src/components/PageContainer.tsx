import * as React from 'react'

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex flex-col w-full lg:max-w-8xl lg:mx-auto px-10 sm:px-6 lg:px-8 py-10">
        {children}
      </div>
    </div>
  )
}

export default PageContainer

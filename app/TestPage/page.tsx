"use client"

import ClickSpark from "@/components/ClickSpark"

export default function TestPage() {
  return (
    <ClickSpark
      sparkColor="red"
      sparkSize={15}
      sparkRadius={30}
      sparkCount={12}
      duration={800}
    >
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <p>Click anywhere inside this box 👆</p>
      </div>
    </ClickSpark>
  )
}

import { FeedbackForm } from "@/components/feedback-form"
import { FeedbackList } from "@/components/feedback-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Home = () => {
  return (
    <div className="font-sans items-center justify-items-center min-h-screen max-w-6xl mx-auto p-8 py-20 gap-16 sm:p-20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-balance mb-4">
            Public Feedback Board
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Share your ideas, report issues, and help us build something amazing
            together.
          </p>
        </div>
      </div>

      <Tabs defaultValue="feedback" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="feedback">View Feedback</TabsTrigger>
          <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-6">
          <FeedbackList />
        </TabsContent>

        <TabsContent value="submit">
          <FeedbackForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Home

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { Counter } from "~/components/ui/counter"; // You'll need to create this
import { ChevronRight, Users, TreePine, Globe, Award } from "lucide-react";

const impactData = [
  {
    category: "Children",
    current: 1200,
    goal: 2000,
    description: "Children Engaged in Educational Programs",
    icon: Users,
    color: "text-blue-500",
  },
  {
    category: "Volunteers",
    current: 150,
    goal: 300,
    description: "Active Volunteers Supporting Our Mission",
    icon: TreePine,
    color: "text-green-500",
  },
  {
    category: "Programs",
    current: 50,
    goal: 75,
    description: "Community Programs Launched",
    icon: Globe,
    color: "text-purple-500",
  },
  {
    category: "Areas",
    current: 12,
    goal: 20,
    description: "Conservation Areas Protected",
    icon: Award,
    color: "text-amber-500",
  }
];

const yearlyData = {
  2021: { children: 800, volunteers: 95, programs: 32, areas: 7 },
  2022: { children: 950, volunteers: 120, programs: 42, areas: 9 },
  2023: { children: 1200, volunteers: 150, programs: 50, areas: 12 },
  2024: { children: null, volunteers: null, programs: null, areas: null },
};

export function Impact() {
  const [activeView, setActiveView] = useState("current");
  const [selectedYear, setSelectedYear] = useState("2023");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full mt-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Making a Difference</Badge>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Environmental Impact</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See how we&apos;re making a difference in our community and environment.
              </p>
            </div>

            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="current">Current Impact</TabsTrigger>
              <TabsTrigger value="historical">Historical Data</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="current" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {impactData.map((item) => (
                <motion.div
                  key={item.category}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="relative"
                  onMouseEnter={() => setHoveredCard(item.category)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <CardHeader className={`flex flex-row items-center justify-between pb-2 ${hoveredCard === item.category ? 'bg-slate-50' : ''}`}>
                      <CardTitle className="text-lg font-semibold">{item.category}</CardTitle>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="text-4xl font-bold mb-2">
                        <Counter end={item.current} />
                        <span className="text-sm font-normal text-gray-500">/{item.goal}</span>
                      </div>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      <div className="mt-4">
                        <Progress value={(item.current / item.goal) * 100} className="h-2" />
                        <p className="text-xs text-right mt-1 text-gray-500">
                          {Math.round((item.current / item.goal) * 100)}% of goal
                        </p>
                      </div>

                      {hoveredCard === item.category && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            Learn more <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Separator className="my-8" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="col-span-1 lg:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>How Your Support Makes a Difference</CardTitle>
                    <CardDescription>See the direct impact of your contributions</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-600 font-bold text-xl mb-1">$25</p>
                        <p className="text-sm text-gray-600">Provides educational materials for 5 children</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-600 font-bold text-xl mb-1">$50</p>
                        <p className="text-sm text-gray-600">Plants 10 native trees in conservation areas</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-purple-600 font-bold text-xl mb-1">$100</p>
                        <p className="text-sm text-gray-600">Funds a community workshop for 15 participants</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="text-center">Join Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 text-center">
                    <p className="mb-6">Help us reach our goals and create lasting environmental change in our communities.</p>
                    <div className="grid gap-3">
                      <Button className="bg-green-600 hover:bg-green-700">Donate Now</Button>
                      <Button variant="outline">Become a Volunteer</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="historical">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Historical Impact Data</CardTitle>
                <CardDescription>See how our impact has grown over the years</CardDescription>
                <div className="flex space-x-2 pt-2">
                  {Object.keys(yearlyData).map((year) => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedYear(year)}
                      className={
                        year === "2024"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                          : ""
                      }
                    >
                      {year} {year === "2024" && "(Projected)"}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {impactData.map((item) => {
                    const yearData = yearlyData[selectedYear as unknown as keyof typeof yearlyData];
                    const value = yearData[item.category.toLowerCase() as keyof typeof yearData];
                    const isProjected = selectedYear === "2024";

                    return (
                      <Card key={item.category} className={isProjected ? "border-dashed" : ""}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{item.category}</CardTitle>
                            <item.icon className={`h-4 w-4 ${item.color}`} />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">
                            {isProjected ? '~' : ''}
                            {value !== null ? (
                              <Counter end={isProjected ? item.goal : value} />
                            ) : (
                              <span className="text-xl text-gray-400">Coming soon</span>
                            )}
                          </div>
                          <div className="mt-2">
                            {!isProjected && value !== null && (
                              <Progress value={(value / item.goal) * 100} className="h-2" />
                            )}
                            {isProjected && (
                              <Progress value={100} className="h-2 bg-blue-100">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }} />
                              </Progress>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {selectedYear === "2024" && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-blue-700">Help us reach our 2024 goals! With your support, we can achieve these projections.</p>
                    <Button className="mt-3 bg-blue-600 hover:bg-blue-700">Support Our 2024 Vision</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}

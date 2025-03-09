/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

// Environmental charity impact data
const data = [
  { month: 'Jan', donations: 12000, treesPlanted: 240, volunteersEngaged: 85, carbonOffset: 18 },
  { month: 'Feb', donations: 15000, treesPlanted: 310, volunteersEngaged: 92, carbonOffset: 22 },
  { month: 'Mar', donations: 18000, treesPlanted: 360, volunteersEngaged: 105, carbonOffset: 27 },
  { month: 'Apr', donations: 22000, treesPlanted: 440, volunteersEngaged: 134, carbonOffset: 33 },
  { month: 'May', donations: 27000, treesPlanted: 540, volunteersEngaged: 156, carbonOffset: 41 },
  { month: 'Jun', donations: 30000, treesPlanted: 600, volunteersEngaged: 178, carbonOffset: 45 },
  { month: 'Jul', donations: 35000, treesPlanted: 700, volunteersEngaged: 215, carbonOffset: 53 },
];

// Calculate total impact
const totalDonations = data.reduce((sum, item) => sum + item.donations, 0);
const totalTrees = data.reduce((sum, item) => sum + item.treesPlanted, 0);
const totalVolunteers = data.reduce((sum, item) => sum + item.volunteersEngaged, 0);
const totalCarbonOffset = data.reduce((sum, item) => sum + item.carbonOffset, 0);

export function InteractiveGraph() {

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Environmental Impact Dashboard</CardTitle>
            <CardDescription>See how your donations directly impact our planet</CardDescription>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-4">
          <div className="rounded-lg border bg-card p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Donations</div>
            <div className="text-2xl font-bold">${totalDonations.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-sm font-medium text-muted-foreground">Trees Planted</div>
            <div className="text-2xl font-bold">{totalTrees.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-sm font-medium text-muted-foreground">Volunteers Engaged</div>
            <div className="text-2xl font-bold">{totalVolunteers.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-sm font-medium text-muted-foreground">Carbon Offset (tons)</div>
            <div className="text-2xl font-bold">{totalCarbonOffset.toLocaleString()}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line">
          <TabsList className="mb-4">
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="area">Area Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="line" className="space-y-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'Month',
                      position: 'insideBottomRight',
                      offset: -10
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: 'Donations ($)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: 'Impact Metrics',
                      angle: 90,
                      position: 'insideRight',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0'
                    }}
                    formatter={(value, name) => {
                      if (name === "donations") return [`$${value}`, "Donations"];
                      if (name === "treesPlanted") return [value, "Trees Planted"];
                      if (name === "volunteersEngaged") return [value, "Volunteers"];
                      if (name === "carbonOffset") return [value, "Carbon Offset (tons)"];
                      return [value, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="donations"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7, stroke: '#16a34a', strokeWidth: 2 }}
                    yAxisId="left"
                  />
                  <Line
                    type="monotone"
                    dataKey="treesPlanted"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7, stroke: '#0ea5e9', strokeWidth: 2 }}
                    yAxisId="right"
                  />
                  <Line
                    type="monotone"
                    dataKey="volunteersEngaged"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2 }}
                    yAxisId="right"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge className="bg-green-600">$30 = 1 Tree Planted</Badge>
              <Badge className="bg-blue-600">$150 = 1 Community Workshop</Badge>
              <Badge className="bg-purple-600">$500 = 1 Ton Carbon Offset</Badge>
            </div>
          </TabsContent>

          <TabsContent value="bar">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'Month',
                      position: 'insideBottomRight',
                      offset: -10
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: 'Donations ($)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: 'Trees Planted',
                      angle: 90,
                      position: 'insideRight',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0'
                    }}
                    formatter={(value, name) => {
                      if (name === "donations") return [`$${value}`, "Donations"];
                      if (name === "treesPlanted") return [value, "Trees Planted"];
                      return [value, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar
                    dataKey="donations"
                    fill="#16a34a"
                    yAxisId="left"
                    name="Donations"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="treesPlanted"
                    fill="#0ea5e9"
                    yAxisId="right"
                    name="Trees Planted"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge className="bg-green-600">Donations</Badge>
              <Badge className="bg-blue-600">Trees Planted</Badge>
            </div>
          </TabsContent>

          <TabsContent value="area">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'Month',
                      position: 'insideBottomRight',
                      offset: -10
                    }}
                  />
                  <YAxis
                    label={{
                      value: 'Environmental Impact',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0'
                    }}
                    formatter={(value, name) => {
                      if (name === "treesPlanted") return [value, "Trees Planted"];
                      if (name === "volunteersEngaged") return [value, "Volunteers Engaged"];
                      if (name === "carbonOffset") return [value, "Carbon Offset (tons)"];
                      return [value, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    type="monotone"
                    dataKey="treesPlanted"
                    stackId="1"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.6}
                    name="Trees Planted"
                  />
                  <Area
                    type="monotone"
                    dataKey="volunteersEngaged"
                    stackId="1"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.6}
                    name="Volunteers Engaged"
                  />
                  <Area
                    type="monotone"
                    dataKey="carbonOffset"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="Carbon Offset (tons)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800">Your Impact Matters</h3>
              <p className="text-green-700">
                Every $30 donated helps us plant a new tree, engage volunteers, and offset carbon emissions.
                Join us in making a difference today!
              </p>
              <Button className="mt-2 bg-green-600 hover:bg-green-700">Donate Now</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

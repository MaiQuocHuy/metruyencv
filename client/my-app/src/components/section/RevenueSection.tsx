"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  DollarSign,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// Sample revenue data
const monthlyRevenue = [
  { month: "Jan", revenue: 8400, subscriptions: 420, growth: 2.5 },
  { month: "Feb", revenue: 9100, subscriptions: 455, growth: 8.3 },
  { month: "Mar", revenue: 10600, subscriptions: 530, growth: 16.5 },
  { month: "Apr", revenue: 9800, subscriptions: 490, growth: -7.5 },
  { month: "May", revenue: 11200, subscriptions: 560, growth: 14.3 },
  { month: "Jun", revenue: 12500, subscriptions: 625, growth: 11.6 },
  { month: "Jul", revenue: 13800, subscriptions: 690, growth: 10.4 },
  { month: "Aug", revenue: 12900, subscriptions: 645, growth: -6.5 },
  { month: "Sep", revenue: 14200, subscriptions: 710, growth: 10.1 },
  { month: "Oct", revenue: 15600, subscriptions: 780, growth: 9.9 },
  { month: "Nov", revenue: 17200, subscriptions: 860, growth: 10.3 },
  { month: "Dec", revenue: 19500, subscriptions: 975, growth: 13.4 },
];

// Subscription data by plan
const subscriptionData = [
  { name: "Basic", value: 35, color: "#8B5CF6" },
  { name: "Premium", value: 45, color: "#C4B5FD" },
  { name: "Annual", value: 20, color: "#5B21B6" },
];

// Revenue sources data
const revenueSources = [
  { name: "Subscriptions", value: 70 },
  { name: "One-time Purchases", value: 15 },
  { name: "Merchandise", value: 10 },
  { name: "Donations", value: 5 },
];

const RevenueSection = () => {
  const [timeRange, setTimeRange] = useState("yearly");
  const [chartView, setChartView] = useState("revenue");

  // Calculate total revenue and subscription numbers
  const totalRevenue = monthlyRevenue.reduce(
    (sum, month) => sum + month.revenue,
    0,
  );
  const totalSubscriptions = monthlyRevenue.reduce(
    (sum, month) => sum + month.subscriptions,
    0,
  );

  // Calculate growth percentage
  const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1].revenue;
  const previousMonthRevenue =
    monthlyRevenue[monthlyRevenue.length - 2].revenue;
  const growthPercentage =
    ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

  return (
    <Card className="bg-card/50 border-manga-600/20 animate-fade-in shadow-lg backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Revenue Dashboard</CardTitle>
        <div className="flex items-center space-x-2">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value)}
          >
            <SelectTrigger className="bg-muted/40 border-manga-600/20 w-[130px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent className="bg-card/90 border-manga-600/40 backdrop-blur-xl">
              <SelectItem value="monthly">Last 30 Days</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="bg-manga-600/10 border-manga-600/20">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-0 pb-4">
              <div className="flex items-baseline space-x-2">
                <DollarSign className="text-manga-400 h-4 w-4" />
                <span className="text-2xl font-bold">
                  {totalRevenue.toLocaleString()}
                </span>
              </div>
              <div
                className={`mt-2 flex items-center text-xs ${growthPercentage >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {growthPercentage >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                <span>
                  {Math.abs(growthPercentage).toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-manga-600/10 border-manga-600/20">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-0 pb-4">
              <div className="flex items-baseline space-x-2">
                <Users className="text-manga-400 h-4 w-4" />
                <span className="text-2xl font-bold">
                  {totalSubscriptions.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 flex items-center text-xs text-green-500">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>8.7% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-manga-600/10 border-manga-600/20">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Average Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-0 pb-4">
              <div className="flex items-baseline space-x-2">
                <DollarSign className="text-manga-400 h-4 w-4" />
                <span className="text-2xl font-bold">
                  {(totalRevenue / totalSubscriptions).toFixed(2)}
                </span>
              </div>
              <div className="mt-2 flex items-center text-xs text-green-500">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>2.4% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="revenue"
          value={chartView}
          onValueChange={setChartView}
          className="space-y-4"
        >
          <TabsList className="bg-muted/40 rounded-lg p-1 backdrop-blur-sm">
            <TabsTrigger
              value="revenue"
              className="data-[state=active]:bg-manga-600/30 data-[state=active]:text-manga-50"
            >
              Revenue Trend
            </TabsTrigger>
            <TabsTrigger
              value="subscriptions"
              className="data-[state=active]:bg-manga-600/30 data-[state=active]:text-manga-50"
            >
              Subscriptions
            </TabsTrigger>
            <TabsTrigger
              value="sources"
              className="data-[state=active]:bg-manga-600/30 data-[state=active]:text-manga-50"
            >
              Revenue Sources
            </TabsTrigger>
          </TabsList>

          {/* Revenue Trend Chart */}
          <TabsContent value="revenue" className="mt-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="border-manga-600/20 rounded-lg border p-4">
                  <h3 className="mb-3 text-sm font-medium">Revenue Trend</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyRevenue}
                        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient
                            id="revenueGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8B5CF6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8B5CF6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          style={{ fontSize: "12px" }}
                          stroke="#A78BFA20"
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          style={{ fontSize: "12px" }}
                          stroke="#A78BFA20"
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                          formatter={(value) => [`$${value}`, "Revenue"]}
                          contentStyle={{
                            backgroundColor: "rgba(23, 20, 33, 0.9)",
                            borderColor: "#8B5CF640",
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#8B5CF6"
                          fillOpacity={1}
                          fill="url(#revenueGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div>
                <div className="border-manga-600/20 h-full rounded-lg border p-4">
                  <h3 className="mb-3 text-sm font-medium">Monthly Growth</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyRevenue}
                        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                      >
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          style={{ fontSize: "12px" }}
                          stroke="#A78BFA20"
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          style={{ fontSize: "12px" }}
                          stroke="#A78BFA20"
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Growth"]}
                          contentStyle={{
                            backgroundColor: "rgba(23, 20, 33, 0.9)",
                            borderColor: "#8B5CF640",
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="growth" radius={[4, 4, 0, 0]}>
                          {monthlyRevenue.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.growth >= 0 ? "#8B5CF6" : "#EF4444"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Subscriptions Chart */}
          <TabsContent value="subscriptions" className="mt-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="border-manga-600/20 rounded-lg border p-4">
                  <h3 className="mb-3 text-sm font-medium">
                    Subscription Growth
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyRevenue}
                        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                      >
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          style={{ fontSize: "12px" }}
                          stroke="#A78BFA20"
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          style={{ fontSize: "12px" }}
                          stroke="#A78BFA20"
                        />
                        <Tooltip
                          formatter={(value) => [`${value}`, "Subscribers"]}
                          contentStyle={{
                            backgroundColor: "rgba(23, 20, 33, 0.9)",
                            borderColor: "#8B5CF640",
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="subscriptions"
                          stroke="#A78BFA"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#A78BFA", strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: "#8B5CF6", strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div>
                <div className="border-manga-600/20 h-full rounded-lg border p-4">
                  <h3 className="mb-3 text-sm font-medium">
                    Subscription Plans
                  </h3>
                  <div className="flex h-[300px] items-center justify-center">
                    <ResponsiveContainer width="100%" height="80%">
                      <PieChart>
                        <Pie
                          data={subscriptionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {subscriptionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Percentage"]}
                          contentStyle={{
                            backgroundColor: "rgba(23, 20, 33, 0.9)",
                            borderColor: "#8B5CF640",
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Revenue Sources Chart */}
          <TabsContent value="sources" className="mt-4">
            <div className="border-manga-600/20 rounded-lg border p-4">
              <h3 className="mb-3 text-sm font-medium">Revenue Sources</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueSources}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {revenueSources.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${250 + index * 20}, ${50 + index * 10}%, ${50 + index * 5}%)`}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Percentage"]}
                      contentStyle={{
                        backgroundColor: "rgba(23, 20, 33, 0.9)",
                        borderColor: "#8B5CF640",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex justify-center space-x-8">
                {revenueSources.map((source, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(${250 + index * 20}, ${50 + index * 10}%, ${50 + index * 5}%)`,
                      }}
                    />
                    <span className="text-sm">{source.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" size="sm" className="text-xs">
            Export Report <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueSection;

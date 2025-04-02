"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function QueryBuilder() {
  const [filters, setFilters] = useState([{ field: "Created At", condition: "in the previous", value: "3 months" }]);
  const [summarize, setSummarize] = useState({ metric: "Count", groupBy: "Created At: Month" });

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      {/* Data Section */}
      <Card className="p-4 bg-blue-50">
        <h3 className="text-blue-700 font-semibold">Data</h3>
        <Button variant="outline" className="mt-2">📊 Orders</Button>
      </Card>

      {/* Filter Section */}
      <Card className="p-4 bg-gray-50">
        <h3 className="text-gray-700 font-semibold">Filter</h3>
        <div className="mt-2 flex gap-2">
          <span className="px-3 py-1 bg-purple-200 text-purple-700 rounded-lg">{filters[0].field} {filters[0].condition} {filters[0].value}</span>
          <Button variant="outline">+</Button>
        </div>
      </Card>

      {/* Summarize Section */}
      <Card className="p-4 bg-green-50">
        <h3 className="text-green-700 font-semibold">Summarize</h3>
        <div className="mt-2 flex gap-2">
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={summarize.metric} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Count">Count</SelectItem>
              <SelectItem value="Sum">Sum</SelectItem>
              <SelectItem value="Average">Average</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-gray-500">by</span>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={summarize.groupBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Created At: Month">Created At: Month</SelectItem>
              <SelectItem value="Created At: Year">Created At: Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button className="bg-blue-500 text-white">Visualize</Button>
        <Button variant="outline">Join Data</Button>
        <Button variant="outline">Custom Column</Button>
        <Button variant="outline">Sort</Button>
        <Button variant="outline">Row Limit</Button>
      </div>
    </div>
  );
}

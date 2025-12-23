"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface University {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  _count: { departments: number };
}

interface Department {
  id: string;
  name: string;
  slug: string;
  universityId: string;
  university: { name: string };
  _count: { advisors: number };
}

interface Advisor {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  departmentId: string;
  department: {
    name: string;
    university: { name: string };
  };
  _count: { reviews: number };
}

type TabType = "universities" | "departments" | "advisors";

export function ManageContent() {
  const [activeTab, setActiveTab] = useState<TabType>("universities");
  const [universities, setUniversities] = useState<University[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "universities") {
        const res = await fetch("/api/admin/universities");
        if (res.ok) {
          const data = await res.json();
          setUniversities(data);
        }
      } else if (activeTab === "departments") {
        const res = await fetch("/api/admin/departments");
        if (res.ok) {
          const data = await res.json();
          setDepartments(data);
        }
      } else if (activeTab === "advisors") {
        const res = await fetch("/api/admin/advisors");
        if (res.ok) {
          const data = await res.json();
          setAdvisors(data);
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: TabType) => {
    if (!confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
      return;
    }

    try {
      const endpoint = `/api/admin/${type}/${id}`;
      const res = await fetch(endpoint, { method: "DELETE" });

      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = `/api/admin/${activeTab}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setShowForm(false);
        setFormData({});
        loadData();
      } else {
        // Show detailed error message
        const errorMsg = data.error || data.details?.[0]?.message || "Failed to create";
        setError(errorMsg);
        console.error("Create error:", data);
      }
    } catch (err) {
      console.error("Error creating:", err);
      setError(err instanceof Error ? err.message : "Failed to create");
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(["universities", "departments", "advisors"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : `Add ${activeTab.slice(0, -1)}`}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          {activeTab === "universities" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location (optional)</label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="e.g., Cambridge, MA"
                />
              </div>
            </>
          )}

          {activeTab === "departments" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">University *</label>
                <select
                  required
                  value={formData.universityId || ""}
                  onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Select university</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </>
          )}

          {activeTab === "advisors" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department *</label>
                <select
                  required
                  value={formData.departmentId || ""}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.university.name} - {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName || ""}
                  onChange={(e) => {
                    const firstName = e.target.value;
                    const lastName = formData.lastName || "";
                    setFormData({
                      ...formData,
                      firstName,
                      slug: generateSlug(`${firstName} ${lastName}`),
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName || ""}
                  onChange={(e) => {
                    const lastName = e.target.value;
                    const firstName = formData.firstName || "";
                    setFormData({
                      ...formData,
                      lastName,
                      slug: generateSlug(`${firstName} ${lastName}`),
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </>
          )}

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <Button type="submit">Create</Button>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === "universities" && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </>
                )}
                {activeTab === "departments" && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">University</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Advisors</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </>
                )}
                {activeTab === "advisors" && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">University</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviews</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTab === "universities" &&
                universities.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u._count.departments}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(u.id, "universities")}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              {activeTab === "departments" &&
                departments.map((d) => (
                  <tr key={d.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{d.university.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{d.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d._count.advisors}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(d.id, "departments")}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              {activeTab === "advisors" &&
                advisors.map((a) => (
                  <tr key={a.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{a.department.university.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{a.department.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{a.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{a._count.reviews}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(a.id, "advisors")}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


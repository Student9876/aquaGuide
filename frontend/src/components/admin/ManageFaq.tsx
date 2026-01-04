import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import JoditEditor from "jodit-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Pencil,
  Check,
  X,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useTextGuide } from "@/hooks/useTextGuide";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { textApi } from "@/api/modules/text";
import { toast } from "sonner";
import { TextGuide } from "@/api/apiTypes";
import { useNavigate } from "react-router-dom";
import CircularLoader from "../ui/CircularLoader";
import { useFaq } from "@/hooks/useFaq";

interface TextGuides {
  id: string;
  name: string;
  author: string;
  status: "pending" | "approved" | "rejected";
  submittedOn: string;
}

const ManageFaq = () => {
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useFaq(page);
  const totalPages = data?.pagination?.totalPages || 1;
  const editor = useRef(null);
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState("");
  const [textGuide, setTextGuide] = useState<string>("");
  const textGuidesArray: TextGuide[] = data?.data || [];
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    navigate(`/view/text/${id}`);
  };

  const createTextGuideMutation = useMutation({
    mutationFn: textApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["texts"] });
      toast.success("Text guide created successfully");
      setTitle("");
      setAnswer("");
    },
    onError: () => {
      toast.error("Failed to create text guide");
    },
  });

  const deleteTextGuideMutation = useMutation({
    mutationFn: textApi.setDelete,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["texts"] });
      toast.success("Text guide deleted successfully");
      setTitle("");
      setAnswer("");
    },
    onError: () => {
      toast.error("Failed to delete text guide");
    },
  });

  const approveorrejectTextGuideMutation = useMutation({
    mutationFn: textApi.setApproveOrReject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["texts"] });
      toast.success("Text guide deleted successfully");
      setTitle("");
      setAnswer("");
    },
    onError: () => {
      toast.error("Failed to update text guide status");
    },
  });

  const handleCreate = () => {
    createTextGuideMutation.mutate({
      title: title,
      content: textGuide,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGuides(textGuidesArray.map((g) => g.id));
    } else {
      setSelectedGuides([]);
    }
  };

  const handleSelectGuide = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedGuides([...selectedGuides, id]);
    } else {
      setSelectedGuides(selectedGuides.filter((gid) => gid !== id));
    }
  };

  const handleBulkAction = (action: "approve" | "reject" | "delete") => {
    if (action === "delete") {
      deleteTextGuideMutation.mutate({ ids: selectedGuides });
    } else if (action === "approve") {
      approveorrejectTextGuideMutation.mutate({
        ids: selectedGuides,
        status: "approved",
      });
    } else if (action === "reject") {
      approveorrejectTextGuideMutation.mutate({
        ids: selectedGuides,
        status: "rejected",
      });
    }
    setSelectedGuides([]);
  };

  const getStatusBadge = (status: TextGuide["status"]) => {
    const variants = {
      pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
      approved: "bg-green-500/20 text-green-600 border-green-500/30",
      rejected: "bg-red-500/20 text-red-600 border-red-500/30",
    };
    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  if (isError)
    return (
      <div className="text-red-600">
        Failed to load guides. Please try again later.
      </div>
    );
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        Manage Text Guides
      </h1>

      {/* Create Guide Form */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Create New Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guide-title">Faq Question</Label>
            <Input
              id="guide-title"
              placeholder="Enter guide title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guide-content">Faq Answer</Label>
            <Textarea
              id="faq-answer"
              placeholder="Enter guide title..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            Post Faq
          </Button>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedGuides.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg border border-border">
          <span className="text-sm text-muted-foreground self-center mr-2">
            {selectedGuides.length} selected:
          </span>

          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-600/10"
            onClick={() => handleBulkAction("delete")}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      )}

      {/* Guides Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Submitted Faq</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <CircularLoader />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedGuides.length === textGuidesArray.length &&
                          textGuidesArray.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Author
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Submitted On
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {textGuidesArray.map((guide) => (
                    <TableRow key={guide.id} className="border-border">
                      <TableCell>
                        <Checkbox
                          checked={selectedGuides.includes(guide.id)}
                          onCheckedChange={(checked) =>
                            handleSelectGuide(guide.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium max-w-[150px] md:max-w-none truncate">
                        {guide.title}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {guide.authorUser.userid}
                      </TableCell>
                      <TableCell>{getStatusBadge(guide.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {guide.createdAt.slice(0, 10)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleNavigate(guide.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8 mb-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 sm:gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium">
                  <span className="px-2 py-1 bg-primary text-primary-foreground rounded-md min-w-[2rem] text-center">
                    {page}
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="flex items-center gap-1 sm:gap-2"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageFaq;

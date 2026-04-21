"use client";

import { useUser, UserProfile } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  const updateName = useMutation(api.users.updateName);
  const deleteAccount = useMutation(api.users.deleteAccount);
  const router = useRouter();

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (currentUser?.name) {
      setName(currentUser.name);
    }
  }, [currentUser]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateName({ name });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      // Delete from Convex
      await deleteAccount();
      // Delete from Clerk
      await user?.delete();
      toast.success("Account deleted successfully");
      router.push("/");
    } catch {
      toast.error("Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-12 w-full mt-4 px-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1E3A5F]">Account Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Manage your profile, security, and account preferences.</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your public display name.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your name" 
              className="max-w-md"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveProfile} 
            disabled={isSaving || !currentUser || name === currentUser.name}
            className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white min-h-[44px]"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      {/* Security Section (Clerk UserProfile) */}
      <div className="w-full">
         <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4">Security & Authentication</h2>
         <div className="[&_.cl-rootBox]:w-full [&_.cl-card]:w-full [&_.cl-card]:max-w-none [&_.cl-card]:shadow-sm [&_.cl-card]:border [&_.cl-card]:border-border [&_.cl-rootBox]:max-w-full w-full flex overflow-x-hidden">
             <UserProfile routing="hash" />
         </div>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-500/20 shadow-sm mt-8">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="bg-red-500 hover:bg-red-600 flex items-center min-h-[44px]">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This will permanently delete your account, including all your uploaded documents, saved CVs, and PDF operation history. 
                  This action is irreversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 flex sm:justify-between items-center w-full">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Yes, delete my account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

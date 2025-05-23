'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Bell, Shield } from 'lucide-react';

const SettingsTab = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <>
      <h3 className="mb-6 text-xl font-semibold">Account Settings</h3>

      <div className="space-y-6">
        <div>
          <h4 className="mb-4 font-medium">Notifications</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Email Notifications</span>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Push Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="mb-4 font-medium">Security</h4>
          <div className="space-y-4">
            <Button variant="outline" className="w-full md:w-auto">
              <Shield className="mr-2 h-4 w-4" /> Change Password
            </Button>
            <div>
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full md:w-auto"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsTab;

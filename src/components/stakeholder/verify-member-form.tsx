"use client";
import {
  ZodAcceptMemberMutationSchema,
  type TypeZodAcceptMemberMutationSchema,
} from "@/trpc/routers/stakeholder-router/schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RiArrowRightLine } from "@remixicon/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "../ui/form";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface VerifyMemberFormProps {
  membershipId: string;
  token: string;
}

export function VerifyMemberForm({
  membershipId,
  token,
}: VerifyMemberFormProps) {
  const { update } = useSession();
  const router = useRouter();
  const acceptMember = api.stakeholder.acceptMember.useMutation({
    onSuccess: async ({ publicId }) => {
      await update();
      router.push(`/${publicId}`);
    },
  });
  const form = useForm<TypeZodAcceptMemberMutationSchema>({
    resolver: zodResolver(ZodAcceptMemberMutationSchema),
    defaultValues: {
      name: "",
      membershipId,
      token,
    },
  });

  async function onSubmit(values: TypeZodAcceptMemberMutationSchema) {
    acceptMember.mutate(values);
  }

  const isSubmitting = form.formState.isSubmitting;
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2 text-center">
          <h1 className="text-3xl font-semibold">Welcome to our OpenCap! 👋</h1>
          <p className="text-muted-foreground">
            Enter your information to complete onboarding
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your full name</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              loading={isSubmitting}
              loadingText="Onboarding..."
              className="w-full"
              type="submit"
            >
              Complete onboarding
              <RiArrowRightLine className="ml-2 inline-block h-5 w-5" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

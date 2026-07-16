import { useEffect } from "react";

import { socket } from "@/services/socket.service";

import {
  useQueryClient,
} from "@tanstack/react-query";

export const useSocketEvents = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on(
      "notificationCreated",
      () => {
        queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });
      }
    );

    socket.on(
      "invoiceUpdated",
      () => {
        queryClient.invalidateQueries({
          queryKey: ["invoices"],
        });

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        });
      }
    );

    return () => {
      socket.off(
        "notificationCreated"
      );

      socket.off(
        "invoiceUpdated"
      );
    };
  }, [queryClient]);
};
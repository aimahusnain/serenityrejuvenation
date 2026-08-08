import { NextRequest, NextResponse } from "next/server";
import {
  createSquarePayment,
  dollarsToCents,
  generateIdempotencyKey,
} from "@/lib/square";
import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const {
      sourceId,
      amount,
      userId,
      bookingId,
    } = body;


    if (!sourceId || !amount || !userId) {

      return NextResponse.json(
        {
          error:
          "Missing sourceId, amount or userId"
        },
        {
          status:400
        }
      );

    }



    const result =
      await createSquarePayment({

        sourceId,

        amountMoney:{

          amount:
          dollarsToCents(amount),

          currency:"USD"

        },

        idempotencyKey:
        generateIdempotencyKey()

      });



    if(!result.success){

      return NextResponse.json(
        {
          error:
          result.error
        },
        {
          status:400
        }
      );

    }



    const payment =
      await prisma.payment.create({

        data:{

          userId,

          amount,

          currency:"USD",

          status:"COMPLETED",

          squarePaymentId:
          result.payment?.id ?? null,

          squareReceiptUrl:
          result.payment?.receiptUrl ?? null,


          metadata:
          JSON.stringify(result.payment)

        }

      });



    return NextResponse.json({

      success:true,

      paymentId:
      payment.id,

      squarePaymentId:
      result.payment?.id

    });



  } catch(error){


    console.error(error);


    return NextResponse.json(
      {
        error:
        "Payment failed"
      },
      {
        status:500
      }
    );

  }

}
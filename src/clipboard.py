import time
import pyperclip
from prisma import Prisma, errors

prisma_client = Prisma()

async def watch_clipboard():
    last_copied_text = ""

    print("Monitoring clipboard... Press Ctrl+C to stop.")

    try:
        await prisma_client.connect();

        while True:
            # Get the current clipboard content
            clipboard_content = pyperclip.paste()

            # Check if the clipboard content has changed
            if clipboard_content != last_copied_text:
                last_copied_text = clipboard_content

                creation = await prisma_client.history.create(data={
                    "contents": clipboard_content,
                    # "details": None
                })

            time.sleep(1)

    except KeyboardInterrupt:
        print("\nStopped monitoring clipboard.")
    finally:
        await prisma_client.disconnect()
        print('Clipboard History Saved!')

async def clipboard_histories():
    # try:
        # await prisma_client.connect();
    histories = await prisma_client.history.find_many(order={"id": "desc"})
    return histories
    
    # except errors.ClientNotConnectedError as e:
        # print(e)

    # finally:
        # await prisma_client.disconnect()


async def clipboard_watcher():
    last_copied_text = ""
    error = { "status": "error", "message":"Failed to save clipboard on database" }

    try:
        await prisma_client.connect()
        clipboard_content = pyperclip.paste()

        if clipboard_content != last_copied_text:
            last_copied_text = clipboard_content

            history = prisma_client.history.create(data={"contents": last_copied_text})
            return history;
        
        return error;

    except KeyboardInterrupt:
        message = "Stopped Clipboard Monitoring!"
        print(f"\n {message}")

        error["message"] = message
        return error;
    finally:
        prisma_client.disconnect()    
        time.sleep(1)

#include "MessageEvent.h"

MessageEvent::MessageEvent()
    : isRunning_(true)
{
    messageThread_ = std::thread(&MessageEvent::messageLoop, this);
}

MessageEvent::~MessageEvent()
{
    isRunning_ = false;
    messageCV_.notify_one();
    messageThread_.join();
}

void MessageEvent::postMessage(const std::string& from, const std::string& to, const std::string& text, bool isUrgent)
{
    std::unique_lock<std::mutex> lock(messageMutex_);
    messageQueue_.push({ from, to, text, isUrgent });
    messageCV_.notify_one();
}

void MessageEvent::messageLoop()
{
    while (isRunning_) {
        std::unique_lock<std::mutex> lock(messageMutex_);
        while (messageQueue_.empty()) {
            messageCV_.wait(lock);
        }
        Message message = messageQueue_.front();
        messageQueue_.pop();
        lock.unlock();

        if (message.isUrgent) {
            // handle urgent message immediately
            std::cout << "Handling urgent message from " << message.from << " to " << message.to << ": " << message.text << std::endl;
        }
        else {
            // handle normal message on separate thread
            std::thread messageHandler([&]() {
                std::this_thread::sleep_for(std::chrono::seconds(1));
                std::cout << "Handling message from " << message.from << " to " << message.to << ": " << message.text << std::endl;
                });
            messageHandler.detach();
        }
    }
}

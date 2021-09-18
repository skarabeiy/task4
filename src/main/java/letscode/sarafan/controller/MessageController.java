package letscode.sarafan.controller;

import com.fasterxml.jackson.annotation.JsonView;
import letscode.sarafan.domain.Message;
import letscode.sarafan.domain.User;
import letscode.sarafan.domain.Views;
import letscode.sarafan.repo.MessageRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("message")
public class MessageController {
    private final MessageRepo messageRepo;

    @Autowired
    public MessageController(MessageRepo messageRepo) {
        this.messageRepo = messageRepo;
    }

    @GetMapping
    @JsonView(Views.IdName.class)
    public List<Message> list() {
        return messageRepo.findAll();
    }

    @GetMapping("{id}")
    @JsonView(Views.FullMessage.class)
    public Message getOne(@PathVariable("id") Message message) {
        return message;
    }



    @PostMapping
    public Message create(@RequestBody Message message, @AuthenticationPrincipal User user) {

            message.setNumber(user.getId());


            if (user.getUserpic().substring(12, 18).equals("google")) {
                message.setSoc("Google");
            } else if(user.getUserpic().substring(8, 10).equals("vk")) {
                message.setSoc("Vkontakte");
            } else{
                message.setSoc("GitHub");
            }



            message.setFirstVisit(user.getFirstVisit());
            if (message.getFirstVisit() == null) {
                message.setFirstVisit(user.getLastVisit());
            }


            message.setName(user.getName());
            message.setCreationDate(user.getLastVisit());
            message.setStatus("Active");

            return messageRepo.save(message);


    }

    @PutMapping("{id}")
    public Message update(
            @PathVariable("id") Message messageFromDb,
            @RequestBody Message message
    ) {
        BeanUtils.copyProperties(message, messageFromDb, "id");
        return messageRepo.save(messageFromDb);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Message message) {
        messageRepo.delete(message);
    }

}